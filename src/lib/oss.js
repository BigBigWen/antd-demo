// 阿里云oss封装
import { message } from 'antd';
import { getAliToken } from 'rest/api/ThirdParty';

const OSS = window.OSS;

class Oss {
  generateSecret = async () => {
    this.secret = await getAliToken();
    return this.createClient(this.secret);
  };

  createClient = secret => {
    const {
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
      securityToken
    } = secret;
    const client = new OSS.Wrapper({
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
      stsToken: securityToken
    });
    return client;
  };

  upload = async ({ key, file, options }) => {
    try {
      let client = await this.generateSecret();
      let result = await client.multipartUpload(key, file, options);
      return result;
    } catch (err) {
      message.error('文件上传失败，请稍后重试');
    }
  };

  getFileUrl = async (key, options) => {
    let client = await this.generateSecret();
    return client.signatureUrl(key, options);
  };
}

export default new Oss();
