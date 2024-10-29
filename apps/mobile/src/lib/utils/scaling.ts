import { Dimensions } from 'react-native';
import { GUIDE_LINE_BASE_HEIGHT, GUIDE_LINE_BASE_WIDTH } from '../data/consts/scaling';

const { width, height } = Dimensions.get('window');

const scale = (size: number) => (width / GUIDE_LINE_BASE_WIDTH) * size;
const verticalScale = (size: number) => (height / GUIDE_LINE_BASE_HEIGHT) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
