/* eslint-disable no-unused-vars */
export interface ImageProps {
  id: number;
  height: string;
  width: string;
  public_id: string;
  format: string;
  blurDataUrl?: string;
  context?: {
    artist?: string;
    location?: string;
    contact?: string;
    about?: string; // New field added here
    title?: string;
    medium?: string;
    size?: string;
    status?: string;
    description?: string;
  };
}

export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}
