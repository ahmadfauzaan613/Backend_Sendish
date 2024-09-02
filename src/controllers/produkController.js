const produkModel = require('../models/produkModel')

const createProduct = (req, res) => {
  try {
    const data = JSON.parse(req.body.data)
    let gambar = req.file ? req.file.buffer.toString('base64') : null

    const productData = {
      nama_produk: data.nama_produk,
      deskripsi_produk: data.deskripsi_produk,
      gambar,
      statusDiskon: data.statusDiskon === 'true' || data.statusDiskon === true,
      harga_lama: data.harga_lama,
      harga_baru: data.harga_baru || null,
      diskon: data.diskon || null,
      createdBy: req.user.username,
      kategoriProduk: data.kategoriProduk || null,
    }

    produkModel.createProduct(productData, (err, results) => {
      if (err) {
        console.error('Error creating product:', err)
        return res.status(500).json({
          message: 'Failed to create product',
          responseCode: 500,
          status: 'error',
        })
      }

      res.status(201).json({
        message: 'Product created successfully',
        responseCode: 201,
        status: 'success',
        data: results,
      })
    })
  } catch (error) {
    console.error('Error parsing request body:', error)
    res.status(400).json({
      message: 'Invalid request',
      responseCode: 400,
      status: 'error',
    })
  }
}

const updateProduct = (req, res) => {
  const productId = req.params.id // Ambil ID dari params
  const data = JSON.parse(req.body.data) // Data produk
  let gambar = req.file ? req.file.buffer.toString('base64') : null // Mengonversi file gambar ke base64 jika ada

  const productData = {
    nama_produk: data.nama_produk,
    deskripsi_produk: data.deskripsi_produk,
    gambar: gambar || data.gambar, // Gunakan gambar baru jika ada, atau tetap gunakan gambar lama
    statusDiskon: data.statusDiskon === 'true' || data.statusDiskon === true,
    harga_lama: data.harga_lama,
    harga_baru: data.harga_baru || null,
    diskon: data.diskon || null,
    kategoriProduk: data.kategoriProduk || null,
    updatedBy: req.user.username,
  }

  produkModel.updateProduct(productId, productData, (err, results) => {
    if (err) {
      console.error('Error updating product:', err)
      return res.status(500).json({
        message: 'Failed to update product',
        responseCode: 500,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Product updated successfully',
      responseCode: 200,
      status: 'success',
      data: results,
    })
  })
}

const getAllProducts = (req, res) => {
  const { search = '', category = '', page = 1, size = 10, sort = 'id', sortOrder = 'ASC' } = req.query

  produkModel.getAllProducts(search, category, parseInt(page), parseInt(size), sort, sortOrder, (err, results) => {
    if (err) {
      console.error('Error retrieving products:', err)
      return res.status(500).json({
        message: 'Failed to retrieve products',
        responseCode: 500,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Products retrieved successfully',
      responseCode: 200,
      status: 'success',
      data: {
        products: results.products,
        pagination: {
          totalData: results.totalData,
          page: parseInt(page),
          size: parseInt(size),
        },
      },
    })
  })
}

const getProductById = (req, res) => {
  const productId = req.params.id

  produkModel.getProductById(productId, (err, product) => {
    if (err) {
      console.error('Error retrieving product:', err)
      return res.status(404).json({
        message: err.message,
        responseCode: 404,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Product retrieved successfully',
      responseCode: 200,
      status: 'success',
      data: product,
    })
  })
}

const deleteProduct = (req, res) => {
  const productId = req.params.id

  produkModel.deleteProduct(productId, (err, result) => {
    if (err) {
      console.error('Error deleting product:', err)
      return res.status(404).json({
        message: err.message,
        responseCode: 404,
        status: 'error',
      })
    }

    res.status(200).json({
      message: result.message,
      responseCode: 200,
      status: 'success',
    })
  })
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
}
