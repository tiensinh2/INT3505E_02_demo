/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Lấy tất cả product
*
* returns List
* */
const productsGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Xóa product theo ID
*
* id String 
* no response value expected for this operation
* */
const productsIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Lấy product theo ID
*
* id String 
* returns Product
* */
const productsIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Cập nhật product theo ID
*
* id String 
* product Product 
* no response value expected for this operation
* */
const productsIdPUT = ({ id, product }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        product,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Tạo product mới
*
* product Product 
* no response value expected for this operation
* */
const productsPOST = ({ product }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        product,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  productsGET,
  productsIdDELETE,
  productsIdGET,
  productsIdPUT,
  productsPOST,
};
