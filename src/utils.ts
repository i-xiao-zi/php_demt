import fs from 'fs';


export const mkdir = (dir: fs.PathLike) => {
    const stat = fs.statSync(dir);
    if (!stat || stat.isDirectory()) {
      fs.mkdirSync(dir, {recursive: true});
    }
}