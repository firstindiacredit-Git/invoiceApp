import mongoose from "mongoose";

 const roundToTwoDecimals = (num) => {
  return Math.round(num * 100) / 100;
};

const InvoiceSchema = mongoose.Schema({
  dueDate: Date,
  currency: String,
  items: [
    {
      itemName: String,
      unitPrice: {
        type: Number,
        set: roundToTwoDecimals, 
      },
      quantity: Number, // Changed to Number for calculations
      discount: {
        type: Number,
        set: roundToTwoDecimals, // Rounds to 2 decimal points
      },
    },
  ],
  rates: {
    type: Number,
    set: roundToTwoDecimals, // Rounds to 2 decimal points
  },
  vat: {
    type: Number,
    set: roundToTwoDecimals, // Rounds to 2 decimal points
  },
  total: {
    type: Number,
    set: roundToTwoDecimals, // Rounds to 2 decimal points
  },
  subTotal: {
    type: Number,
    set: roundToTwoDecimals, // Rounds to 2 decimal points
  },
  notes: String,
  status: String,
  invoiceNumber: String,
  type: String,
  creator: [String],
  totalAmountReceived: {
    type: Number,
    set: roundToTwoDecimals, // Rounds to 2 decimal points
  },
  client: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  paymentRecords: [
    {
      amountPaid: {
        type: Number,
        set: roundToTwoDecimals, // Rounds to 2 decimal points
      },
      datePaid: Date,
      paymentMethod: String,
      note: String,
      paidBy: String,
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const InvoiceModel = mongoose.model("InvoiceModel", InvoiceSchema);
export default InvoiceModel;
