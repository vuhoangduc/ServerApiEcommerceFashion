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
    static async getAllCategory() {
        const category = await categorySchema.find();
        if (!category) { return { message: 'Không có loại sản phẩm nào' } }
        return {
            category
        }
    }
}

module.exports = CategoryService;