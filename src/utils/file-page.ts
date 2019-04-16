import path from 'path';

export default function filePage(fileName: string): string {
  return 'file://' + path.resolve('./src/__mockData__', fileName);
}
