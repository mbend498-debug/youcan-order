const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// إعدادات المنتج
// ===============================

const YOUCAN_API = "https://api.youcan.shop";

const PRODUCT_ID = "025e9e1c-f544-464d-ac50-7bb5ec3cb35d";

const PRODUCT_PRICE = 2800;

// الخصم: 400 دج لكل قطعة إضافية
const EXTRA_PIECE_DISCOUNT = 400;


// ===============================
// أسعار التوصيل
// office = المكتب
// home   = المنزل
// ===============================

const SHIPPING = {
  "01": { name: "Adrar", office: 700, home: 1400 },
  "02": { name: "Chlef", office: 300, home: 450 },
  "03": { name: "Laghouat", office: 450, home: 850 },
  "04": { name: "Oum El Bouaghi", office: 450, home: 850 },
  "05": { name: "Batna", office: 450, home: 800 },
  "06": { name: "Béjaïa", office: 450, home: 800 },
  "07": { name: "Biskra", office: 450, home: 850 },
  "08": { name: "Béchar", office: 500, home: 1300 },
  "09": { name: "Blida", office: 450, home: 750 },
  "10": { name: "Bouira", office: 450, home: 700 },
  "11": { name: "Tamanrasset", office: 600, home: 1600 },
  "12": { name: "Tébessa", office: 450, home: 750 },
  "13": { name: "Tlemcen", office: 450, home: 850 },
  "14": { name: "Tiaret", office: 450, home: 750 },
  "15": { name: "Tizi Ouzou", office: 450, home: 700 },
  "16": { name: "Alger", office: 450, home: 500 },
  "17": { name: "Djelfa", office: 450, home: 850 },
  "18": { name: "Jijel", office: 450, home: 700 },
  "19": { name: "Sétif", office: 450, home: 700 },
  "20": { name: "Saïda", office: 450, home: 750 },
  "21": { name: "Skikda", office: 450, home: 700 },
  "22": { name: "Sidi Bel Abbès", office: 450, home: 750 },
  "23": { name: "Annaba", office: 450, home: 700 },
  "24": { name: "Guelma", office: 450, home: 700 },
  "25": { name: "Constantine", office: 450, home: 700 },
  "26": { name: "Médéa", office: 450, home: 750 },
  "27": { name: "Mostaganem", office: 450, home: 800 },
  "28": { name: "M’Sila", office: 450, home: 750 },
  "29": { name: "Mascara", office: 450, home: 800 },
  "30": { name: "Ouargla", office: 500, home: 900 },
  "31": { name: "Oran", office: 450, home: 700 },
  "32": { name: "El Bayadh", office: 600, home: 1000 },
  "33": { name: "Illizi", office: 1000, home: 1500 },
  "34": { name: "Bordj Bou Arreridj", office: 450, home: 700 },
  "35": { name: "Boumerdès", office: 450, home: 750 },
  "36": { name: "El Tarf", office: 450, home: 750 },
  "37": { name: "Tindouf", office: 1000, home: 1650 },
  "38": { name: "Tissemsilt", office: 450, home: 850 },
  "39": { name: "El Oued", office: 450, home: 850 },
  "40": { name: "Khenchela", office: 450, home: 750 },
  "41": { name: "Souk Ahras", office: 450, home: 750 },
  "42": { name: "Tipaza", office: 450, home: 650 },
  "43": { name: "Mila", office: 450, home: 700 },
  "44": { name: "Ain Defla", office: 400, home: 650 },
  "45": { name: "Naama", office: 450, home: 1100 },
  "46": { name: "Ain Témouchent", office: 450, home: 750 },
  "47": { name: "Ghardaia", office: 600, home: 950 },
  "48": { name: "Relizane", office: 450, home: 650 },
  "49": { name: "Timimoun", office: 1000, home: 1400 },
  "50": { name: "Bordj Badji Mokhtar", office: 1000, home: 1500 },
  "51": { name: "Ouled Djellal", office: 450, home: 750 },
  "52": { name: "Béni Abbès", office: 600, home: 1000 },
  "53": { name: "In Salah", office: 1000, home: 1600 },
  "54": { name: "In Guezzam", office: 1000, home: 1600 },
  "55": { name: "Touggourt", office: 450, home: 850 },
  "56": { name: "Djanet", office: 1000, home: 1600 },
  "57": { name: "El M’ghair", office: 450, home: 900 },
  "58": { name: "El Menia", office: 500, home: 1100 }
};


// ===============================
// التحقق من Access Token
// ===============================

function getToken() {
  const token = process.env.YOUCAN_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      "YOUCAN_ACCESS_TOKEN غير موجود في Environment Variables"
    );
  }

  return token;
}


// ===============================
// طلب إلى YouCan API
// ===============================

async function youcanRequest(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(
    `${YOUCAN_API}${endpoint}`,
    {
      ...options,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    console.error("YouCan API Error:", response.status, data);

    throw new Error(
      data?.detail ||
      data?.message ||
      `YouCan API error ${response.status}`
    );
  }

  return data;
}


// ===============================
// جلب Product Variant
// ===============================

async function getProductVariantId() {
  const product = await youcanRequest(
    `/products/${PRODUCT_ID}?include=variants`
  );

  const variants =
    product?.variants ||
    product?.data?.variants ||
    [];

  if (!variants.length) {
    throw new Error(
      "لم يتم العثور على Product Variant للمنتج."
    );
  }

  return variants[0].id;
}


// ===============================
// جلب Shipping Rates من YouCan
// ===============================
//
// YouCan يستخدم Shipping Rate ID بصيغة:
// sr_UUID
//
// سنبحث عن السعر المطابق لسعر التوصيل.
// ===============================

async function findShippingRateId(price) {
  const result = await youcanRequest(
    "/shipping-zones?include=rates"
  );

  const zones =
    result?.data ||
    result ||
    [];

  for (const zone of zones) {

    if (!zone) continue;

    if (zone.is_active === false) continue;

    const rates = zone.rates || [];

    for (const rate of rates) {

      const ratePrice = Number(rate.price);

      if (
        Number.isFinite(ratePrice) &&
        ratePrice === Number(price)
      ) {
        return `sr_${rate.id}`;
      }
    }
  }

  return null;
}


// ===============================
// تقسيم الاسم
// ===============================

function splitName(fullName) {

  const clean = String(fullName || "")
    .trim()
    .replace(/\s+/g, " ");

  const parts = clean.split(" ");

  const firstName = parts.shift() || "Customer";

  const lastName = parts.join(" ") || firstName;

  return {
    firstName,
    lastName
  };
}


// ===============================
// إنشاء Customer
// ===============================

async function createCustomer({
  fullName,
  phone,
  wilayaName
}) {

  const { firstName, lastName } =
    splitName(fullName);

  return await youcanRequest(
    "/customers",
    {
      method: "POST",

      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        country: "Algeria",
        region: wilayaName,
        city: wilayaName,
        notes: "Customer created from custom product order form"
      })
    }
  );
}


// ===============================
// الصفحة الرئيسية
// ===============================

app.get("/", (req, res) => {

  res.json({
    status: "ok",
    service: "YouCan custom order API",
    product_id: PRODUCT_ID
  });

});


// ===============================
// اختبار الاتصال بـ YouCan
// ===============================

app.get("/api/test", async (req, res) => {

  try {

    const data = await youcanRequest("/me");

    res.json({
      success: true,
      message: "الاتصال بـ YouCan يعمل.",
      store: data
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// ===============================
// إنشاء الطلب
// ===============================

app.post("/api/order", async (req, res) => {

  try {

    const {
      fullName,
      phone,
      wilaya,
      color,
      size,
      quantity,
      deliveryType,
      address
    } = req.body;


    // ---------------------------
    // التحقق
    // ---------------------------

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "الاسم الكامل مطلوب."
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "رقم الهاتف مطلوب."
      });
    }

    if (!wilaya) {
      return res.status(400).json({
        success: false,
        message: "الولاية مطلوبة."
      });
    }

    if (!SHIPPING[wilaya]) {
      return res.status(400).json({
        success: false,
        message: "الولاية غير صحيحة."
      });
    }

    if (!color) {
      return res.status(400).json({
        success: false,
        message: "اللون مطلوب."
      });
    }

    if (!size) {
      return res.status(400).json({
        success: false,
        message: "المقاس مطلوب."
      });
    }


    const qty = Number(quantity);

    if (
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "الكمية يجب أن تكون بين 1 و50."
      });
    }


    if (
      deliveryType !== "office" &&
      deliveryType !== "home"
    ) {
      return res.status(400).json({
        success: false,
        message: "طريقة التوصيل غير صحيحة."
      });
    }


    // ---------------------------
    // حساب سعر التوصيل
    // ---------------------------

    const wilayaData = SHIPPING[wilaya];

    const shippingPrice =
      deliveryType === "office"
        ? wilayaData.office
        : wilayaData.home;


    // ---------------------------
    // حساب سعر المنتجات
    // ---------------------------

    const productSubtotal =
      PRODUCT_PRICE * qty;

    const discount =
      EXTRA_PIECE_DISCOUNT * (qty - 1);

    const productsTotal =
      productSubtotal - discount;

    const total =
      productsTotal + shippingPrice;


    // ---------------------------
    // الحصول على Variant ID
    // ---------------------------

    const productVariantId =
      await getProductVariantId();


    // ---------------------------
    // الحصول على Shipping Rate ID
    // ---------------------------

    const shippingRateId =
      await findShippingRateId(shippingPrice);


    if (!shippingRateId) {

      return res.status(400).json({

        success: false,

        message:
          `لم نجد Shipping Rate في YouCan بسعر ${shippingPrice} دج. ` +
          `يجب إضافة سعر الشحن هذا إلى إعدادات الشحن في YouCan أولاً.`,

        required_shipping_price: shippingPrice

      });

    }


    // ---------------------------
    // إنشاء العميل
    // ---------------------------

    const customer =
      await createCustomer({
        fullName,
        phone,
        wilayaName: wilayaData.name
      });


    const customerId =
      customer?.id ||
      customer?.data?.id;


    if (!customerId) {

      throw new Error(
        "تم إنشاء العميل ولكن لم يتم الحصول على Customer ID."
      );

    }


    // ---------------------------
    // عنوان الشحن
    // ---------------------------

    const { firstName, lastName } =
      splitName(fullName);


    const shippingAddress = {

      is_new: true,

      first_name: firstName,

      last_name: lastName,

      phone: phone,

      first_line:
        address ||
        (
          deliveryType === "home"
            ? `Livraison à domicile - ${wilayaData.name}`
            : `Stop desk - ${wilayaData.name}`
        ),

      region: wilayaData.name,

      city: wilayaData.name,

      country_code: "DZ"

    };


    // ---------------------------
    // إنشاء الطلب
    // ---------------------------

    const order =
      await youcanRequest(
        "/orders",
        {
          method: "POST",

          body: JSON.stringify({

            customer_id: customerId,

            selected_shipping_estimation_id:
              shippingRateId,

            variants: [

              {

                product_variant_id:
                  productVariantId,

                quantity: qty,

                price: PRODUCT_PRICE

              }

            ],

            shipping_address:
              shippingAddress,

            extra_fields: {

              color: color,

              size: size,

              wilaya_code: wilaya,

              wilaya_name: wilayaData.name,

              delivery_type:
                deliveryType === "office"
                  ? "Stop desk"
                  : "Home",

              delivery_price:
                shippingPrice,

              quantity: qty,

              product_price:
                PRODUCT_PRICE,

              quantity_discount:
                discount,

              calculated_products_total:
                productsTotal,

              calculated_total:
                total

            },

            discount: {

              value: discount,

              type: 2,

              reason:
                "400 DZD discount for each additional piece"

            },

            notes:
              `Custom order form | ` +
              `Color: ${color} | ` +
              `Size: ${size} | ` +
              `Wilaya: ${wilayaData.name} | ` +
              `Delivery: ${
                deliveryType === "office"
                  ? "Stop desk"
                  : "Home"
              } | ` +
              `Quantity: ${qty} | ` +
              `Shipping: ${shippingPrice} DZD`

          })
        }
      );


    // ---------------------------
    // نجاح
    // ---------------------------

    res.status(201).json({

      success: true,

      message:
        "تم إنشاء الطلب بنجاح داخل YouCan.",

      order: order,

      summary: {

        quantity: qty,

        product_price:
          PRODUCT_PRICE,

        discount:
          discount,

        products_total:
          productsTotal,

        shipping:
          shippingPrice,

        total:
          total

      }

    });


  } catch (error) {

    console.error(
      "ORDER ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "حدث خطأ أثناء إنشاء الطلب."

    });

  }

});


// ===============================
// تشغيل السيرفر
// ===============================

const PORT =
  process.env.PORT || 10000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `YouCan Order API running on port ${PORT}`
    );

  }
);
