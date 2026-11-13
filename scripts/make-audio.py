"""Génère la bande-son (120 BPM, 15 s) : public/audio/tn-beat.wav
Tout est synthétisé (aucun sample) et calé sur les coupes de la vidéo.
Usage : python3 scripts/make-audio.py   (dépendances : numpy, scipy)"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100
BPM = 120
BEAT = 60 / BPM            # 0.5 s
STEP = BEAT / 4            # double-croche
DUR = 15.0
GAIN = 0.80               # crête finale (≈ -13 LUFS intégrés, crête vraie < -1 dBTP)
N = int(SR * DUR)
rng = np.random.default_rng(73)
mix = np.zeros((N, 2))        # musique, charleys, effets
low = np.zeros((N, 2))        # kick, basse, impacts (non creusés par le sidechain)
rev_send = np.zeros((N, 2))

def t_(d): return np.arange(int(SR * d)) / SR
def bp(x, lo, hi, order=4): return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)
def hp(x, f, order=4): return sosfilt(butter(order, f, btype='high', fs=SR, output='sos'), x)
def lp(x, f, order=4): return sosfilt(butter(order, f, btype='low', fs=SR, output='sos'), x)
def note(n): return 440 * 2 ** ((n - 69) / 12)  # numéro MIDI -> Hz

def add(buf, x, at, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if i >= N or i < 0: return
    x = x[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    if x.ndim == 1:
        buf[i:i + len(x), 0] += x * gain * l * 1.414
        buf[i:i + len(x), 1] += x * gain * r * 1.414
    else:
        buf[i:i + len(x)] += x * gain

# ---------- instruments ----------
def kick():
    t = t_(0.45)
    f = 46 + 120 * np.exp(-t / 0.03)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.17)
    click = hp(rng.standard_normal(len(t)), 2000) * np.exp(-t / 0.004) * 0.35
    return np.tanh(2.4 * (x + click)) * 0.9

def sub808(midi, dur=0.55):
    t = t_(dur + 0.25)
    f = note(midi) * (1 + 0.5 * np.exp(-t / 0.02))
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.minimum(1, t / 0.004) * np.exp(-np.maximum(0, t - dur * 0.4) / 0.22)
    x = np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    return np.tanh(2.0 * x * env) * 0.75      # saturation : audible aussi sur haut-parleur de téléphone

def hat(open_=False, vel=1.0):
    t = t_(0.4 if open_ else 0.09)
    x = hp(rng.standard_normal(len(t)), 7500) * np.exp(-t / (0.11 if open_ else 0.017))
    return x * 0.34 * vel

def clap():
    t = t_(0.5)
    n = bp(rng.standard_normal(len(t)), 900, 4200)
    env = np.exp(-t / 0.11)
    for d in (0.0, 0.011, 0.023):
        env += 1.4 * np.exp(-np.maximum(0, t - d) / 0.006) * (t >= d)
    return n * env * 0.36

def crash(dur=1.6):
    t = t_(dur)
    return hp(rng.standard_normal(len(t)), 3800) * np.exp(-t / (dur / 3.2)) * 0.3

def sweep_noise(dur, f0, f1, env, bands=14, width=0.42):
    """Bruit dans un passe-bande dont le centre glisse de f0 à f1 (banc de filtres pondéré)."""
    t = t_(dur)
    n = rng.standard_normal(len(t))
    cs = np.geomspace(140, 12000, bands)
    center = f0 * (f1 / f0) ** (t / dur)
    out = np.zeros(len(t))
    for c in cs:
        w = np.exp(-0.5 * (np.log(center / c) / width) ** 2)
        out += bp(n, c / 1.25, min(c * 1.25, SR / 2 - 200), 2) * w
    return out * env(t)

def whoosh(dur=0.5, up=True):
    f0, f1 = (500, 7000) if up else (6000, 400)
    return sweep_noise(dur, f0, f1, lambda t: np.exp(-0.5 * ((t - dur * 0.62) / (dur * 0.2)) ** 2)) * 0.5

def impact():
    t = t_(2.2)
    f = 34 + 70 * np.exp(-t / 0.09)
    boom = np.tanh(2.2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.55)) * 0.95
    thud = lp(rng.standard_normal(len(t)), 900) * np.exp(-t / 0.16) * 0.5
    return boom + thud

def pad(midis, dur, bright=1400):
    t = t_(dur)
    x = np.zeros(len(t))
    for m in midis:
        for det in (-0.004, 0.0, 0.004):
            f = note(m) * (1 + det)
            for h in range(1, 9):
                x += np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28)) / h
    env = np.minimum(1, t / 0.25) * np.minimum(1, (dur - t) / 0.3)
    return lp(x, bright) * env * 0.02

def pluck(midi):
    t = t_(0.5)
    f = note(midi)
    x = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(4 * np.pi * f * t) + 0.18 * np.sin(6 * np.pi * f * t)
    return x * np.exp(-t / 0.13) * np.minimum(1, t / 0.002) * 0.16

# ---------- structure ----------
DROP = 2.0                       # flash : la paire apparaît
OUTRO = 12.0                     # plan final
CUTS = [5.0, 6.5, 8.0, 9.0]      # transitions entre les plans
# Fa mineur : i - i - VI - VII - i  (une mesure = 2 s)
BARS = [  # (fondamentale de la basse, notes de l'arpège)
    (29, [65, 68, 72, 68, 75, 72, 68, 67]),
    (29, [65, 68, 72, 68, 77, 72, 68, 72]),
    (25, [61, 65, 68, 65, 73, 68, 65, 68]),
    (27, [63, 67, 70, 67, 75, 70, 67, 70]),
    (29, [65, 68, 72, 68, 77, 75, 72, 68]),
]
PAD = {29: [53, 56, 60], 25: [49, 53, 56], 27: [51, 55, 58]}
KICK_STEPS = [0, 6, 10]
kick_times = []

# Intro (0-2 s) : montée
add(mix, sweep_noise(2.0, 250, 9000, lambda t: (t / 2.0) ** 1.8) * 0.8, 0.0)
tr = t_(2.0)
add(mix, np.sin(2 * np.pi * np.cumsum(180 * (8.0) ** (tr / 2.0)) / SR) * (tr / 2.0) ** 2 * 0.05, 0.0)
add(mix, pad([41, 53, 56, 60], 2.05, 700) * 1.5, 0.0)
for s in range(16):                                   # tics qui s'accélèrent
    if s < 8 and s % 2: continue
    add(mix, hat(vel=0.35 + 0.65 * s / 15), s * STEP, pan=0.3 if s % 2 else -0.3)
for s in range(8):                                    # roulement final (triples-croches)
    add(mix, hat(vel=0.5 + 0.5 * s / 7), 1.5 + s * STEP / 2, pan=(s % 2) * 0.5 - 0.25)

# Groove (2-12 s)
for b, (root, arp) in enumerate(BARS):
    t0 = DROP + b * 4 * BEAT
    add(mix, pad(PAD[root], 4 * BEAT + 0.3), t0, pan=0)
    for s in range(16):
        ts = t0 + s * STEP
        if s in KICK_STEPS:
            add(low, kick(), ts); kick_times.append(ts)
            add(low, sub808(root, 0.6 if s == 0 else 0.4), ts, gain=0.95)
        if s == 8:
            add(mix, clap(), ts); add(rev_send, clap(), ts, gain=0.5)
        if s % 2 == 0:
            add(mix, hat(vel=1.0 if s % 4 == 0 else 0.6), ts, pan=0.25)
        if s == 4:
            add(mix, hat(open_=True, vel=0.7), ts, pan=-0.3)
        if s in (13, 15) and b % 2 == 1:              # petit roulement en fin de mesure paire
            add(mix, hat(vel=0.5), ts, pan=-0.2); add(mix, hat(vel=0.4), ts + STEP / 2, pan=0.4)
        if s % 2 == 0:
            p = pluck(arp[s // 2])
            add(mix, p, ts, pan=-0.35 if (s // 2) % 2 else 0.35)
            add(mix, p, ts + 3 * STEP, gain=0.4, pan=0.35 if (s // 2) % 2 else -0.35)   # écho croche pointée
            add(rev_send, p, ts, gain=0.6)

# Accents calés sur l'image
add(low, impact(), DROP, gain=0.9); add(mix, crash(), DROP, gain=1.0); add(rev_send, crash(0.6), DROP, gain=0.5)
for i, c in enumerate(CUTS):
    w = whoosh(0.5, up=(i % 2 == 0))
    add(mix, w, c - 0.31, gain=0.9, pan=-0.5 if i % 2 else 0.5)
    add(mix, crash(0.7), c, gain=0.35, pan=0.4 if i % 2 else -0.4)
add(mix, whoosh(0.7), OUTRO - 0.43, gain=1.0)

# Outro (12-15 s) : impact puis nappe qui s'éteint
add(low, impact(), OUTRO, gain=1.0); add(mix, crash(2.2), OUTRO, gain=0.9); add(rev_send, crash(1.0), OUTRO, gain=0.6)
add(mix, pad([41, 53, 56, 60, 65], 3.0, 1100) * 1.8, OUTRO)
for k, m in enumerate([77, 72, 68, 65]):
    p = pluck(m); add(mix, p, OUTRO + 0.25 + k * BEAT, gain=0.9, pan=0.3 - 0.2 * k); add(rev_send, p, OUTRO + 0.25 + k * BEAT, gain=1.0)

# Réverbération (réponse impulsionnelle : bruit décroissant)
tr = t_(1.6)
ir = np.stack([lp(rng.standard_normal(len(tr)), 6000) * np.exp(-tr / 0.42) for _ in range(2)], axis=1)
ir /= np.sqrt((ir ** 2).sum(axis=0))
wet = np.stack([fftconvolve(rev_send[:, c], ir[:, c])[:N] for c in range(2)], axis=1)
mix += wet * 0.5

# Sidechain : la musique se creuse légèrement sous chaque kick (effet de pompe discret)
duck = np.ones(N)
td = t_(0.25)
for kt in kick_times:
    i = int(kt * SR); seg = (1 - 0.45 * np.exp(-td / 0.08))[: N - i]
    duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], seg)
mix = mix * duck[:, None] * 1.5 + low

# Mastering : passe-haut, saturation douce, niveau cible, fondu de fin
mix = np.stack([hp(mix[:, c], 28, 2) for c in range(2)], axis=1)
mix /= np.percentile(np.abs(mix), 99.95)          # les crêtes arrivent autour de 1 avant saturation
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
mix *= GAIN / np.abs(mix).max()
tt = np.arange(N) / SR
fade = np.clip((DUR - 0.05 - tt) / 1.5, 0, 1) ** 1.6
mix *= fade[:, None]
wavfile.write('public/audio/tn-beat.wav', SR, (mix * 32767).astype(np.int16))
print('ok', N / SR, 's, peak', float(np.abs(mix).max()))
