import fs from "fs";
import * as Http from "http";
import * as Https from "https";


export const mkdir = (dir: fs.PathLike) => {
  let stat = undefined;
    try {
      stat = fs.statSync(dir);
    } catch(_) {}
    if (!stat) {
      fs.mkdirSync(dir, {recursive: true});
    } else if (!stat.isDirectory()) {
      fs.rmSync(dir, {force: true, recursive: true});
      fs.mkdirSync(dir, {recursive: true});
    }
};

export const download = async (uri: string, dest: fs.PathLike): Promise<void> => {
  const url = new URL(uri);
  const transport = url.protocol === "https:" ? Https : Http;
  const request = transport.get(url, (response) => {
    if (response.statusCode !== 200) {
        return Promise.reject(new Error(`请求失败，状态码: ${response.statusCode}`));
    }
    const fileStream = fs.createWriteStream(dest);
    response.pipe(fileStream);
    fileStream.on('finish', () => {
        fileStream.close();
        return Promise.resolve();
    });
    fileStream.on('error', (err) => {
        fs.unlink(dest, () => {}); // 删除部分下载的文件
        return Promise.reject(err);
    });
  });
  request.on('error', (err) => {
      return Promise.reject(err);
  });
  return new Promise((resolve, reject) => {
    request.end();
  });
};

export const http = {
  get: (uri: string) => {
    return new Promise((resolve, reject) => {
      const url = new URL(uri);
      const transport = url.protocol === "https:" ? Https : Http;
      transport.get(url, (res) => {
        resolve(res);
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
};