import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  line_items: [
    {
      quantity: { type: String, required: true },
      price_data: {
        currency: { type: String, required: true },
        unit_amount: { type: String, required: true },
        product_data: {
          name:{ type: String, required: true },

        },
      },
      
    },
  ],
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  paid: { type: Boolean, default: false },
}, {timestamps:true}
);

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
