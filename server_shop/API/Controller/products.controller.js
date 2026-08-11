
const Categories = require('../../Model/categories.model')
const Products = require('../../Model/products.model')
const uploadCloudinary = require("../../utils/uploadCloudinary");

//Get All Product
module.exports.index = async (req, res) => {
    const products = await Products.find()
    res.json(products)
}

//Get Category Product
module.exports.category = async (req, res) => {
    const category = req.query.category
    const products = await Products.find({ category: category })
    res.json(products)
}

// Get Categories
module.exports.categories = async (req, res) => {
    const categories = await Categories.find();
    res.json(categories)
}

// POST Category
module.exports.createCategory = async (req, res) => {
    try {
        const category = await Categories.create(req.body);
        res.json(category);
    } catch (error) {
        return res.json('Server Error!');
    }
}

// POST Category
module.exports.detailCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Categories.findOne({ _id: id});
        res.json(category);
    } catch (error) {
        return res.json('Server Error!');
    }
}

// PUT Category
module.exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category } = req.body;
        var categoryObj = await Categories.findOne({_id: id});
        categoryObj.category = category;
        categoryObj.save();
        res.json(categoryObj);
    } catch (error) {
        return res.json('Server Error!');
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await Categories.deleteOne({ _id: id });

        res.json("Delete success");
    } catch (error) {
        res.status(500).json("Delete failed");
    }
};

// POST Product
module.exports.createProduct = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const fileImage = req.files.file;

    const uploadResult = await uploadCloudinary(fileImage.data);

    const data = {
      ...req.body,

      img1: uploadResult.secure_url,
    };

    const product = await Products.create(data);

    return res.json(product);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Create product failed",
    });
  }
};

// PUT Product
module.exports.updateProduct = async (req, res) => {
    // try {
        const { id } = req.params;
        const { name, price, category, description } = req.body;
        var product = await Products.findOne({_id: id});

        if (req.files && req.files.file) {
          const uploadResult = await uploadCloudinary(req.files.file.data);

          product.img1 = uploadResult.secure_url;
        }
        
        product.name = name;
        product.price = price;
        product.category = category;
        product.description = description;
        product.save();
        res.json(product);
    // } catch (error) {
    //     return res.json('Server Error!');
    // }
}

//Get Detail Product
module.exports.detail = async (req, res) => {
    const id = req.params.id
    const products = await Products.findOne({ _id: id})
    res.json(products)
}

//Pagination Phát Triển Thêm Chức năng Search và Phân Loại Sản Phẩm
module.exports.pagination = async (req, res) => {
    try {
        //Lấy page từ query
        const page = parseInt(req.query.page) || 1

        //Lấy số lượng từ query
        const numberProduct = parseInt(req.query.count) || 1

        // //Lấy key search từ query
        // const keyWordSearch = req.query.search

        //Lấy category từ query
        const category = req.query.category

        //Lấy sản phẩm đầu và sẩn phẩm cuối
        var start = (page - 1) * numberProduct
        var end = page * numberProduct

        var products

        //Phân loại điều kiện category từ client gửi lên
        if (category === 'all'){
            products = await Products.find()
        }else{
            products = await Products.find({ category: category })
        }
        
        var paginationProducts = products.slice(start, end);

        const data = {
            products: paginationProducts,
            total: products.length
        };

        res.json(data);

        // if (!keyWordSearch){
            
        //     res.json(paginationProducts)

        // }else{
        //     var newData = paginationProducts.filter(value => {
        //         return value.name.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
        //         value.price.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 || value.category.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1
        //     })
        //     res.json(newData)
        // }
    } catch (error) {
        res.json("Fail");
    }
}

// DELETE Product
module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Products.findOne({ _id: id });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Products.deleteOne({ _id: id });

        res.json({ message: "Delete product success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Delete failed" });
    }
}