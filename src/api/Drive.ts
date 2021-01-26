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

const apiUrl = process.env.NODE_ENV === 'production' ? '/gato/drive' : 'http://localhost:3040/drive'

export function getFolder(path: string): Promise<DriveResponse> {
  return fetch(`${apiUrl}${path}`).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json() as Promise<DriveResponse>
    } else {
      throw new Error(`Fetch returned ${response.status} when loading ${path}`)
    }
  })
}
