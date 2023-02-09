const mongoose = require('mongoose');

const SaleItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        display: {
            type: String,
            required: true,
            trim: true
        },
    }
);

const SaleItem = mongoose.model("saleItem_list", SaleItemSchema);

module.exports = SaleItem;