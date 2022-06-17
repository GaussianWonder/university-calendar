import Delta from "quill-delta";

export interface HasDeltaDescription {
  description: Delta;
}

export interface HasDeltaContent {
  content: Delta;
}
