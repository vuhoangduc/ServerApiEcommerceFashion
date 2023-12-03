const categorySchema = require('../models/category.model');

class CategoryService {
    static async createCategory(thumb, { category_name }) {
        console.log(thumb);
        console.log(category_name);
        const newCategory = await categorySchema.create(
            { category_name, category_thumb: thumb }
        )
        if (!newCategory) return { message: 'cố lỗi khi tạo danh mục sản phẩm' };
        return {
            message: 'Tạo danh mục sản phẩm thành công',
            newCategory
        }
    }
    static async updateCategory(thumb, { id_category,category_name }) {
        const updateCategory = await categorySchema.findOneAndUpdate(
            {_id: id_category},
            { $set: {category_name, category_thumb: thumb} }
        )
        if (!updateCategory) return { message: 'cố lỗi khi sửa danh mục sản phẩm' };
        return {
            message: 'Sửa danh mục sản phẩm thành công',
            updateCategory
        }
    }
    static async deleteCategory({ id_category }) {
        console.log(id_category);
        const deleteCategory = await categorySchema.findOneAndDelete({_id: id_category})
        if (!deleteCategory) return { message: 'cố lỗi khi xóa danh mục sản phẩm' };
        return {
            message: 'Xóa danh mục sản phẩm thành công',
            deleteCategory
        }
    }
    static async getAllCategory() {
        const category = await categorySchema.find({});
        if (!category) { return { message: 'Không có loại sản phẩm nào' } }
        return {
            category
        }
    }
}

module.exports = CategoryService;