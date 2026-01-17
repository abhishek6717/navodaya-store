import e from "express";
import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {

    if (!req.fields || !req.files) {
        return res.status(400).json({ status: false, message: 'Invalid form data' });
    }

    const { name, price, category, quantity, description, rating } = req.fields || {};
    const photo = req.files?.photo;

    if (!name || !price || !category || !quantity || !description) {
      return res.status(400).json({ status: false, message: 'All fields are required' });
    }

    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ status: false, message: 'Product already exists' });
    }

    const productData = {
      name,
      slug: slugify(name),
      price,
      category,
      quantity,
      rating: rating ? Number(rating) : 0,
      description,
      photo: null,
    };

    // attach photo if provided (productModel should expect { data, contentType })
    if (photo && photo.path) {
      const fileBuffer = fs.readFileSync(photo.path);
      productData.photo = {
        data: fileBuffer,
        contentType: photo.type || photo.mimetype || 'application/octet-stream',
      };
    }

    const newProduct = await new productModel(productData).save();

    return res.status(201).json({
      status: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error during product creation:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
export const getAllProductsController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category');  
        return res.status(200).json({
            status: true,
            message: 'Products fetched successfully',
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const getProductController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ status: false, message: "Product id is required" });
        }
        const product = await productModel.findById(id).populate('category');
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }
        return res.status(200).json({
            status: true,
            message: "Product fetched successfully",
            product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, quantity, description, rating } = req.fields || {};

        const photo = req.files?.photo;
        if (!id) {
            return res.status(400).json({ 'status': false, message: 'Product id is required' });
        }
        if (!name || !price || !category || !quantity || !description) {
            return res.status(400).json({ 'status': false, message: 'All fields are required' });
        }
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            {
                name,
                slug: slugify(name),
                price,  
                category,
                quantity,
                description 
            },
            { new: true }
        );  
        if (!updatedProduct) {
            return res.status(404).json({ 'status': false, message: 'Product not found' });
        }       
        return res.status(200).json({
            status: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }   
};
export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ 'status': false, message: 'Product id is required' });
        }
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ 'status': false, message: 'Product not found or already deleted' });
        }
        return res.status(200).json({
            status: true,
            message: 'Product deleted successfully',
            product: deletedProduct
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ status: false, message: "Product id is required" });
        }
        const product = await productModel.findById(id).select('photo');
        if (!product || !product.photo || !product.photo.data) {
            return res.status(404).json({ status: false, message: "Product photo not found" });
        }
        res.set("Content-Type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
    }
    catch (error) {
        console.error("Error fetching product photo:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getProductsByCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).json({ status: false, message: "Category id is required" });
        }
        const products = await productModel.find({ category: categoryId }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return res.status(500).json({   
            message: "Internal server error",
            error: error.message
        });
    }
    };

export const searchProductsController = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ status: false, message: "Search keyword is required" });
        }
        const regex = new RegExp(keyword, 'i'); // case-insensitive search
        const products = await productModel.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Search results fetched successfully",
            products
        });
    } catch (error) {
        console.error("Error searching products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const filterProductsController = async (req, res) => {
    try {
        const { minPrice, maxPrice, categoryIds } = req.body;
        const filterCriteria = {};
        if (minPrice !== undefined && maxPrice !== undefined) {
            filterCriteria.price = { $gte: minPrice, $lte: maxPrice };
        }
        if (categoryIds && categoryIds.length > 0) {
            filterCriteria.category = { $in: categoryIds };
        }
        const products = await productModel.find(filterCriteria).populate('category');
        return res.status(200).json({
            status: true,   
            message: "Filtered products fetched successfully",
            products
        });
    }
    catch (error) {
        console.error("Error filtering products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const productPaginationController = async (req, res) => {
    try {
        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;        
        const products = await productModel.find({})
            .skip(skip)
            .limit(limit)
            .populate('category');

        const totalProducts = await productModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        return res.status(200).json({
            status: true,
            message: "Paginated products fetched successfully",
            page,
            totalPages,
            products
        });
    }
    catch (error) {
        console.error("Error with product pagination:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const productCountController = async (req, res) => {
    try {
        const totalProducts = await productModel.countDocuments();
        return res.status(200).json({
            status: true,
            message: "Total product count fetched successfully",
            totalProducts
        });
    }
    catch (error) {
        console.error("Error fetching product count:", error);
        return res.status(500).json({

            message: "Internal server error",
            error: error.message
        });
    }   
};
export const relatedProductsController = async (req, res) => {
    try {
        const { productId, categoryId } = req.params;
        if (!productId || !categoryId) {
            return res.status(400).json({ status: false, message: "Product id and Category id are required" });
        }
        const relatedProducts = await productModel.find({
            category: categoryId,
            _id: { $ne: productId } // exclude the current product
        }).limit(5).populate('category');
        return res.status(200).json({
            status: true,
            message: "Related products fetched successfully",
            relatedProducts
        });
    }
    catch (error) {
        console.error("Error fetching related products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const productPhotoController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ status: false, message: "Product id is required" });
        }
        const product = await productModel.findById(id).select('photo');
        if (!product || !product.photo || !product.photo.data) {
            return res.status(404).json({ status: false, message: "Product photo not found" });
        }
        res.set("Content-Type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
    }
    catch (error) {
        console.error("Error fetching product photo:", error);
        return res.status(500).json({   
            message: "Internal server error",
            error: error.message
        });
    }
};


export const featuredProductsController = async (req, res) => {
    try {
        const featuredProducts = await productModel.find({ isFeatured: true }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Featured products fetched successfully",
            featuredProducts
        });
    }
    catch (error) {
        console.error("Error fetching featured products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const updateProductStockController = async (req, res) => {
    try {
        const { productId, quantitySold } = req.body;   
        if (!productId || !quantitySold) {
            return res.status(400).json({ status: false, message: "Product id and quantity sold are required" });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }
        product.quantity -= quantitySold;
        product.sold += quantitySold;
        await product.save();
        return res.status(200).json({
            status: true,
            message: "Product stock updated successfully",
            product
        });
    }
    catch (error) {
        console.error("Error updating product stock:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const clearProductStockController = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ status: false, message: "Product id is required" });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }
        product.quantity = 0;
        await product.save();
        return res.status(200).json({   
            status: true,
            message: "Product stock cleared successfully",
            product
        });
    }
    catch (error) {
        console.error("Error clearing product stock:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const lowStockProductsController = async (req, res) => {
    try {
        const lowStockProducts = await productModel.find({ quantity: { $lt: 5 } }).populate('category');
        return res.status(200).json({   
            status: true,
            message: "Low stock products fetched successfully",
            lowStockProducts
        });
    }
    catch (error) {
        console.error("Error fetching low stock products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const topSellingProductsController = async (req, res) => {
    try {
        const topSellingProducts = await productModel.find({}).sort({ sold: -1 }).limit(10).populate('category');
        return res.status(200).json({
            status: true,
            message: "Top selling products fetched successfully",
            topSellingProducts
        });
    }
    catch (error) {
        console.error("Error fetching top selling products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const updateProductRatingController = async (req, res) => {
    try {
        const { productId, rating } = req.body;
        if (!productId || rating === undefined) {
            return res.status(400).json({ status: false, message: "Product id and rating are required" });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }
        product.ratings = product.ratings || [];
        product.ratings.push(rating);
        const totalRatings = product.ratings.length;
        const sumRatings = product.ratings.reduce((sum, r) => sum + r, 0);
        product.averageRating = sumRatings / totalRatings;
        await product.save();
        return res.status(200).json({
            status: true,
            message: "Product rating updated successfully",
            product
        });
    }
    catch (error) {
        console.error("Error updating product rating:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const resetProductRatingsController = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ status: false, message: "Product id is required" });
        }   
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }
        product.ratings = [];
        product.averageRating = 0;
        await product.save();

        return res.status(200).json({
            status: true,
            message: "Product ratings reset successfully",  
            product
        });
    }
    catch (error) {
        console.error("Error resetting product ratings:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }

};
export const getProductRatingsController = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ status: false, message: "Product id is required" });
        }   
        const product = await productModel.findById(productId).select('ratings averageRating');
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }
        return res.status(200).json({
            status: true,
            message: "Product ratings fetched successfully",
            ratings: product.ratings,
            averageRating: product.averageRating
        });
    } catch (error) {
        console.error("Error fetching product ratings:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const clearAllProductRatingsController = async (req, res) => {
    try {
        const result = await productModel.updateMany(
            {},
            { $set: { ratings: [], averageRating: 0 } }
        );
        return res.status(200).json({
            status: true,
            message: "All product ratings cleared successfully",
            modifiedCount: result.nModified
        });
    }
    catch (error) {
        console.error("Error clearing all product ratings:", error);
        return res.status(500).json({

            message: "Internal server error",
            error: error.message
        });
    }
};
export const getProductsWithNoRatingsController = async (req, res) => {
    try {
        const products = await productModel.find({ $or: [ { ratings: { $exists: false } }, { ratings: { $size: 0 } } ] }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Products with no ratings fetched successfully",
            products
        });
    }   
    catch (error) {
        console.error("Error fetching products with no ratings:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getAverageProductRatingController = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ status: false, message: "Product id is required" });
        }
        const product = await productModel.findById(productId).select('averageRating');
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }   
        return res.status(200).json({
            status: true,
            message: "Average product rating fetched successfully", 
            averageRating: product.averageRating
        });
    }   
    catch (error) {
        console.error("Error fetching average product rating:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};  
export const getProductsAboveRatingController = async (req, res) => {
    try {
        const { rating } = req.params;
        if (rating === undefined) {
            return res.status(400).json({ status: false, message: "Rating value is required" });
        }
        const products = await productModel.find({ averageRating: { $gte: parseFloat(rating) } }).populate('category');
        return res.status(200).json({
            status: true,

            message: "Products above specified rating fetched successfully",
            products
        });
    }   
    catch (error) {
        console.error("Error fetching products above rating:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }   
};
export const getProductsBelowRatingController = async (req, res) => {
    try {
        const { rating } = req.params;

        if (rating === undefined) {
            return res.status(400).json({ status: false, message: "Rating value is required" });
        }
        const products = await productModel.find({ averageRating: { $lte: parseFloat(rating) } }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Products below specified rating fetched successfully",
            products
        });
    }
    catch (error) {
        console.error("Error fetching products below rating:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getMostRatedProductsController = async (req, res) => {
    try {
        const mostRatedProducts = await productModel.find({})
            .sort({ 'ratings.length': -1 })
            .limit(10)
            .populate('category');
        return res.status(200).json({
            status: true,
            message: "Most rated products fetched successfully",
            mostRatedProducts
        });
    }   
    catch (error) {
        console.error("Error fetching most rated products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getProductsByRatingRangeController = async (req, res) => {
    try {
        const { minRating, maxRating } = req.body;
        const filterCriteria = {};
        if (minRating !== undefined && maxRating !== undefined) {
            filterCriteria.averageRating = { $gte: minRating, $lte: maxRating };
        }

        const products = await productModel.find(filterCriteria).populate('category');
        return res.status(200).json({
            status: true,
            message: "Products by rating range fetched successfully",
            products
        });
    }
    catch (error) {
        console.error("Error fetching products by rating range:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }   
};

export const getRecentlyAddedProductsController = async (req, res) => {
    try {
        const recentlyAddedProducts = await productModel.find({})   
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('category');
        return res.status(200).json({
            status: true,
            message: "Recently added products fetched successfully",
            recentlyAddedProducts
        });
    }   
    catch (error) {
        console.error("Error fetching recently added products:", error);
        return res.status(500).json({

            message: "Internal server error",
            error: error.message
        });
    }
};

export const getProductsByNameController = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ status: false, message: "Product name is required" });
        }
        const regex = new RegExp(name, 'i'); // case-insensitive search
        const products = await productModel.find({ name: { $regex: regex } }).populate('category');
        return res.status(200).json({
            status: true,

            message: "Products by name fetched successfully",
            products
        });
    }   
    catch (error) {
        console.error("Error fetching products by name:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getProductsByPriceRangeController = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.params;
        if (minPrice === undefined || maxPrice === undefined) {
            return res.status(400).json({ status: false, message: "Min and Max price are required" });
        }   
        const products = await productModel.find({
            price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
        }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Products by price range fetched successfully",
            products
        });
    }       
    catch (error) {
        console.error("Error fetching products by price range:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }

};
export const bulkUpdateProductStockController = async (req, res) => {
    try {
        const { updates } = req.body; // expects an array of { productId, quantitySold }
        if (!updates || !Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ status: false, message: "Updates array is required" });
        }
        const bulkOperations = updates.map(update => ({
            updateOne: {
                filter: { _id: update.productId },
                update: {
                    $inc: {
                        quantity: -update.quantitySold,
                        sold: update.quantitySold
                    }
                }
            }
        }));
        const result = await productModel.bulkWrite(bulkOperations);
        return res.status(200).json({
            status: true,
            message: "Bulk product stock updated successfully",
            result
        });
    }
    catch (error) {
        console.error("Error in bulk updating product stock:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const bulkClearProductStockController = async (req, res) => {
    try {

        const { productIds } = req.body; // expects an array of productIds
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ status: false, message: "Product IDs array is required" });
        }
        const result = await productModel.updateMany(
            { _id: { $in: productIds } },
            { $set: { quantity: 0 } }
        );
        return res.status(200).json({
            status: true,
            message: "Bulk product stock cleared successfully",
            modifiedCount: result.nModified
        });
    }

    catch (error) {
        console.error("Error in bulk clearing product stock:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getProductsByIdsController = async (req, res) => {
    try {
        const { productIds } = req.body; // expects an array of productIds
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ status: false, message: "Product IDs array is required" });
        }
        const products = await productModel.find({ _id: { $in: productIds } }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Products by IDs fetched successfully",
            products
        });
    }
    catch (error) {
        console.error("Error fetching products by IDs:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getProductsWithPhotosController = async (req, res) => {
    try {
        const products = await productModel.find({ photo: { $exists: true, $ne: null } }).populate('category'); 
        return res.status(200).json({
            status: true,
            message: "Products with photos fetched successfully",
            products
        });
    }   
    catch (error) {
        console.error("Error fetching products with photos:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }   
};
export const getProductsWithoutPhotosController = async (req, res) => {
    try {

        const products = await productModel.find({ $or: [ { photo: { $exists: false } }, { photo: null } ] }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Products without photos fetched successfully",
            products
        });
    }
    catch (error) {
        console.error("Error fetching products without photos:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getProductsByQuantityController = async (req, res) => {
    try {
        const { minQuantity, maxQuantity } = req.params;
        if (minQuantity === undefined || maxQuantity === undefined) {
            return res.status(400).json({ status: false, message: "Min and Max quantity are required" });
        }
        const products = await productModel.find({
            quantity: { $gte: parseInt(minQuantity), $lte: parseInt(maxQuantity) }
        }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Products by quantity range fetched successfully",
            products
        });
    }

    catch (error) {
        console.error("Error fetching products by quantity range:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getOutOfStockProductsController = async (req, res) => {
    try {
        const outOfStockProducts = await productModel.find({ quantity: { $lte: 0 } }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Out of stock products fetched successfully",
            outOfStockProducts
        });
    }

    catch (error) {
        console.error("Error fetching out of stock products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getProductsByCreationDateController = async (req, res) => {
    try {
        const { startDate, endDate } = req.params;
        if (!startDate || !endDate) {
            return res.status(400).json({ status: false, message: "Start date and End date are required" });
        }

        const products = await productModel.find({
            createdAt: {
                $gte: new Date(startDate),  
                $lte: new Date(endDate)
            }
        }).populate('category');
        return res.status(200).json({
            status: true,
            message: "Products by creation date range fetched successfully",
            products
        });
    }
    catch (error) {
        console.error("Error fetching products by creation date range:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
















