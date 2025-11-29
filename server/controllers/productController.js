const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = {};

        // Filter by Category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search by Name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        let productsQuery = Product.find(query);

        // Sorting
        if (sort === 'price-asc') {
            productsQuery = productsQuery.sort({ price: 1 });
        } else if (sort === 'price-desc') {
            productsQuery = productsQuery.sort({ price: -1 });
        } else {
            productsQuery = productsQuery.sort({ createdAt: -1 }); // Newest first
        }

        const products = await productsQuery;
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by MongoDB ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        // Remove legacy id if present to prevent duplicate key errors
        if (req.body.id) delete req.body.id;

        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = req.body.name || product.name;
            product.price = req.body.price || product.price;
            product.description = req.body.description || product.description;
            product.image = req.body.image || product.image;
            product.images = req.body.images || product.images;
            product.category = req.body.category || product.category;
            product.countInStock = req.body.countInStock || product.countInStock;
            product.originalPrice = req.body.originalPrice || product.originalPrice;
            product.features = req.body.features || product.features;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400).json({ message: 'Product already reviewed' });
                return;
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed products (for initial setup)
// @route   POST /api/products/seed
// @access  Public (should be protected in prod)
exports.seedProducts = async (req, res) => {
    try {
        const { products } = req.body; // Expects array of products
        await Product.deleteMany(); // Clear existing
        const createdProducts = await Product.insertMany(products);
        res.status(201).json(createdProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
