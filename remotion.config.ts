import { Config } from '@remotion/cli/config';

// Les médias (captures, clips, musique, police) sont lus directement dans ./assets/
Config.setPublicDir('./assets');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(18);
