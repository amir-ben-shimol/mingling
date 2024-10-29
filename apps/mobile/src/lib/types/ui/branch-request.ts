import type { DocumentPickerAsset } from 'expo-document-picker';
import type { ImagePickerAsset } from 'expo-image-picker';

export type File = DocumentPickerAsset & ImagePickerAsset;
