/**
 * 加密解密工具
 *
 * Made By Douzi＂
 */

var rsa = require('node-rsa');
var crypto = require('crypto');

function CryptoUtil() {
  //公有方法
  this.MD5 = MD5;
  this.AESEncrypt = AES256_ECB_Encrypt;
  this.AESDecrypt = AES256_ECB_Decrypt;
  this.RSA_OAEP_Encrypt = RSA_OAEP_Encrypt;
  this.RSA_OAEP_Decrypt = RSA_OAEP_Decrypt;
  this.RSA_Encrypt = RSA_Encrypt;
  this.RSA_Decrypt = RSA_Decrypt;
  this.Base64Encode = Base64Encode;
  this.Base64Decode = Base64Decode;

  //MD5(原文)
  function MD5(oriMsg) {
    var md5 = crypto.createHash('md5');
    md5.update(oriMsg);
    var result = md5.digest('hex');
    return result;
  }

  //AES加密(原文,密钥)  PS:密钥为32位字符串
  function AES256_ECB_Encrypt(oriMsg, key) {
    try {
      var iv = '';
      var aesEncryptCipher = crypto.createCipheriv('aes-256-ecb', key, iv);
      var result = aesEncryptCipher.update(oriMsg, 'utf8', 'base64') + aesEncryptCipher.final('base64');
      return result;
    } catch (e) {
      return null;
    }
  }

  //AES解密(密文,密钥)  PS:密钥为32位字符串
  function AES256_ECB_Decrypt(cryMsg, key) {
    try {
      var iv = '';
      var aesDecryptCipher = crypto.createDecipheriv('aes-256-ecb', key, iv);
      var result = aesDecryptCipher.update(cryMsg, 'base64', 'utf8') + aesDecryptCipher.final('utf8');
      return result;
    } catch (e) {
      return null;
    }
  }

  //RSA-OAEP加密(原文,密钥)  PS:密钥为PKCS8公钥
  function RSA_OAEP_Encrypt(oriMsg, pubKey) {
    try {
      var publicKey = new rsa(pubKey);
      var result = publicKey.encrypt(oriMsg, 'base64');
      return result;
    } catch (e) {
      return null;
    }
  }

  //RSA-OAEP解密(密文,密钥)  PS:密钥为PKCS8私钥
  function RSA_OAEP_Decrypt(cryMsg, priKey) {
    try {
      var privateKey = new rsa(priKey);
      var result = privateKey.decrypt(cryMsg, 'utf-8');
      return result;
    } catch (e) {
      return null;
    }
  }

  var _rsaOpt = {
    encryptionScheme: {
      scheme: 'pkcs1',
    }
  };

  //RSA-PKCS1加密(原文,密钥)  PS:密钥为PKCS8公钥
  function RSA_Encrypt(oriMsg, pubKey) {
    try {
      var publicKey = new rsa(pubKey, _rsaOpt);
      var result = publicKey.encrypt(oriMsg, 'base64');
      return result;
    } catch (e) {
      return null;
    }
  }

  //RSA-PKCS1解密(密文,密钥)  PS:密钥为PKCS8私钥
  function RSA_Decrypt(cryMsg, priKey) {
    try {
      var privateKey = new rsa(priKey, _rsaOpt);
      var result = privateKey.decrypt(cryMsg, 'utf-8');
      return result;
    } catch (e) {
      return null;
    }
  }

  //Base64编码
  function Base64Encode(msg) {
    return new Buffer(msg).toString('base64');
  }

  //Base64解码
  function Base64Decode(msg) {
    return new Buffer(msg, 'base64').toString();
  }
}

//单例
var instance = new CryptoUtil();
module.exports = instance;