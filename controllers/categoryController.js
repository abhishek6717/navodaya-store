import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {    
            return res.status(400).json({ 'status': false, message: 'Name is required' });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ 'status': false, message: 'Category already exists' });
        }
        const newCategory = await new categoryModel({ name,slug:slugify(name) }).save();
        if (!newCategory) {
            return res.status(500).json({ 'status': false, message: 'Category creation failed' });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Category created successfully',
                category: newCategory
            });
        }   
    } catch (error) {
        console.error('Error during category creation:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }   
};

export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        return res.status(200).json({
            status: true,
            message: 'Categories fetched successfully',
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({  
            message: 'Internal server error',
            error: error.message
        });
    }   
};

export const getCategoryController = async (req, res) => {
    try {
        const { id } = req.params; // <-- get id from params
        if (!id) {
            return res.status(400).json({ status: false, message: "Category id is required" });
        }

        const category = await categoryModel.findById(id); // <-- find by _id
        if (!category) {
            return res.status(404).json({ status: false, message: "Category not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Category fetched successfully",
            category
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;  
        if (!id) {
            return res.status(400).json({ 'status': false, message: 'Category id is required' });
        }
        const deletedCategory = await categoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ 'status': false, message: 'Category not found or already deleted' });
        }   
        return res.status(200).json({
            status: true,
            message: 'Category deleted successfully',
            category: deletedCategory
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const updateCategoryController = async (req, res) => {
    try {
        const { id } = req.params;  
        const { name, slug } = req.body;
        if (!name) {
            return res.status(400).json({ 'status': false, message: 'Name is required' });
        }
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        );  
        if (!updatedCategory) {
            return res.status(404).json({ 'status': false, message: 'Category not found' });
        }
        return res.status(200).json({
            status: true,
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export default {
    createCategoryController,
    getAllCategoriesController,
    getCategoryController,
    deleteCategoryController,
    updateCategoryController
};