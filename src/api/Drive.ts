export interface Item {
  filename: string;
  path: string;
  type: "image" | "folder";
  url: string;
}

export interface DriveResponse {
  path: string;
  name: string;
  items: Item[];
  parent: string | undefined;
}