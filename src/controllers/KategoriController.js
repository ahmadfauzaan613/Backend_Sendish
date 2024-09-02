const kategoriModel = require('../models/kategori_produk')

const createKategoriProduk = (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Name is required',
      responseCode: 400,
      status: 'error',
    })
  }

  kategoriModel.createKategoriProduk(name, (err, result) => {
    if (err) {
      console.error('Error creating Kategori Produk:', err)
      return res.status(500).json({
        message: 'Failed to create Kategori Produk',
        responseCode: 500,
        status: 'error',
      })
    }

    res.status(201).json({
      message: 'Kategori Produk created successfully',
      responseCode: 201,
      status: 'success',
      data: {
        id: result.insertId,
        name,
      },
    })
  })
}

const updateKategoriProdukController = (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Name is required',
      responseCode: 400,
      status: 'error',
    })
  }

  kategoriModel.updateKategoriProduk(id, name, (err, kategori) => {
    if (err) {
      console.error('Error updating Kategori Produk:', err)
      return res.status(500).json({
        message: 'Failed to update Kategori Produk',
        responseCode: 500,
        status: 'error',
      })
    }

    if (!kategori) {
      return res.status(404).json({
        message: 'Kategori Produk not found',
        responseCode: 404,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Kategori Produk updated successfully',
      responseCode: 200,
      status: 'success',
      data: kategori,
    })
  })
}

const deleteKategoriProdukController = (req, res) => {
  const { id } = req.params

  kategoriModel.deleteKategoriProduk(id, (err, results) => {
    if (err) {
      console.error('Error deleting Kategori Produk:', err)
      return res.status(500).json({
        message: 'Failed to delete Kategori Produk',
        responseCode: 500,
        status: 'error',
      })
    }

    if (!results) {
      return res.status(404).json({
        message: 'Kategori Produk not found',
        responseCode: 404,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Kategori Produk deleted successfully',
      responseCode: 200,
      status: 'success',
    })
  })
}

const getAllKategoriProdukController = (req, res) => {
  const { search = '', page = 1, limit = 5, sortOrder = 'ASC' } = req.query

  kategoriModel.getAllKategoriProduk(search, parseInt(page), parseInt(limit), sortOrder, (err, results) => {
    if (err) {
      console.error('Error retrieving kategori_produk:', err)
      return res.status(500).json({
        message: 'Failed to retrieve kategori_produk',
        responseCode: 500,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Kategori_produk retrieved successfully',
      responseCode: 200,
      status: 'success',
      data: {
        categories: results.categories,
        pagination: {
          totalData: results.totalData,
          page: parseInt(page),
          size: parseInt(limit),
        },
      },
    })
  })
}

module.exports = {
  createKategoriProduk,
  updateKategoriProdukController,
  deleteKategoriProdukController,
  getAllKategoriProdukController,
}
