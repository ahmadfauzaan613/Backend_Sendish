const { getAllTransaksiModel, createTransaksi, generateCodeTransaksi, updateStatusTransaksi, deleteTransaksiById, getTransaksiByCodeFromModel, getTransaksiByIdFromModel } = require('../models/TransaksiModel')

const createTransaksiController = (req, res) => {
  try {
    const data = JSON.parse(req.body.data)
    let buktiPembayaran = req.file ? req.file.buffer.toString('base64') : null

    const transaksiData = {
      code_transaksi: generateCodeTransaksi(),
      nama_lengkap: data.nama_lengkap,
      no_handphone: data.no_handphone,
      alamat: data.alamat,
      metode_pembayaran: data.metode_pembayaran,
      sistem_pembayaran: data.sistem_pembayaran,
      total_harga: data.total_harga,
      status_pembelian: data.status_pembelian,
      bukti_pembayaran: buktiPembayaran,
      dataProduk: data.dataProduk || [],
    }

    createTransaksi(transaksiData, (err, results) => {
      if (err) {
        console.error('Error creating transaksi:', err)
        return res.status(500).json({
          message: 'Failed to create transaksi',
          responseCode: 500,
          status: 'error',
        })
      }

      res.status(201).json({
        message: 'Transaksi created successfully',
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

const updateStatusTransaksiController = (req, res) => {
  const { id } = req.params
  const { status_pembelian } = req.body

  if (!status_pembelian) {
    return res.status(400).json({
      message: 'Status pembelian is required',
      responseCode: 400,
      status: 'error',
    })
  }

  // Ambil username dari req.user atau sesuaikan sesuai implementasi Anda
  const updatedBy = req.user ? req.user.username : 'system'

  updateStatusTransaksi(id, status_pembelian, updatedBy, (err, data) => {
    if (err) {
      console.error('Error updating status pembelian:', err)
      return res.status(500).json({
        message: 'Failed to update status pembelian',
        responseCode: 500,
        status: 'error',
      })
    }

    if (!data) {
      return res.status(404).json({
        message: 'Transaction not found',
        responseCode: 404,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Status pembelian updated successfully',
      responseCode: 200,
      status: 'success',
      data: {
        code_transaksi: data.code_transaksi,
        status_pembelian: data.status_pembelian,
        updatedBy: data.updatedBy,
      },
    })
  })
}

const deleteTransaksi = (req, res) => {
  const { id } = req.params

  deleteTransaksiById(id, (err, results) => {
    if (err) {
      console.error('Error deleting transaksi:', err)
      return res.status(500).json({
        message: 'Failed to delete transaksi',
        responseCode: 500,
        status: 'error',
      })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        message: 'Transaction not found',
        responseCode: 404,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Transaksi deleted successfully',
      responseCode: 200,
      status: 'success',
    })
  })
}

const getTransaksiById = (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      message: 'ID is required',
      responseCode: 400,
      status: 'error',
    })
  }

  getTransaksiByIdFromModel(id, (err, transaksi) => {
    if (err) {
      console.error('Error fetching transaksi:', err)
      return res.status(500).json({
        message: 'Failed to fetch transaksi',
        responseCode: 500,
        status: 'error',
      })
    }

    if (!transaksi) {
      return res.status(404).json({
        message: 'Transaction not found',
        responseCode: 404,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Transaction fetched successfully',
      responseCode: 200,
      status: 'success',
      data: transaksi,
    })
  })
}

const getTransaksiByCode = (req, res) => {
  const { code_transaksi } = req.body

  if (!code_transaksi) {
    return res.status(400).json({
      message: 'Code transaksi is required',
      responseCode: 400,
      status: 'error',
    })
  }

  getTransaksiByCodeFromModel(code_transaksi, (err, transaksi) => {
    if (err) {
      console.error('Error fetching transaksi:', err)
      return res.status(500).json({
        message: 'Failed to fetch transaksi',
        responseCode: 500,
        status: 'error',
      })
    }

    if (!transaksi) {
      return res.status(404).json({
        message: 'Transaction not found',
        responseCode: 404,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Transaction fetched successfully',
      responseCode: 200,
      status: 'success',
      data: transaksi,
    })
  })
}

const getTransaksiController = (req, res) => {
  const { page = 1, limit = 10, sortOrder = 'ASC', ...filters } = req.query

  if (isNaN(page) || isNaN(limit) || !['ASC', 'DESC'].includes(sortOrder)) {
    return res.status(400).json({
      message: 'Invalid query parameters',
      responseCode: 400,
      status: 'error',
    })
  }

  getAllTransaksiModel(filters, parseInt(page), parseInt(limit), sortOrder, (err, result) => {
    if (err) {
      console.error('Error fetching transaksi:', err)
      return res.status(500).json({
        message: 'Failed to fetch transaksi',
        responseCode: 500,
        status: 'error',
      })
    }

    res.status(200).json({
      message: 'Transaksi fetched successfully',
      responseCode: 200,
      status: 'success',
      data: {
        transaksi: result.transaksi,
        pagination: {
          totalData: result.totalData,
          page: parseInt(page),
          size: parseInt(limit),
        },
      },
    })
  })
}

module.exports = {
  createTransaksiController,
  updateStatusTransaksiController,
  deleteTransaksi,
  getTransaksiById,
  getTransaksiController,
  getTransaksiByCode,
}
