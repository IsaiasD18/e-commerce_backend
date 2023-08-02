const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const data = await Product.findAll({
      // be sure to include its associated Category and Tag data
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        }
      ]
    })
    res.json(data);

  } catch (error) {
    res.json({ message: error.message });

  }

});

// get one product
// find a single product by its `id`
router.get('/:id', async (req, res) => {
  try {
    const data = await Product.findByPk(req.params.id, {
      // be sure to include its associated Category and Tag data
      include: [
        {
          model: Category
        },
        {
          model: Tag,
          through: ProductTag,
        }
      ]
    });

    if (!data) {
      res.json('No product found with that id!');
      return;
    }

    res.json(data);

  } catch (error) {
    res.json({ message: error.message });
  }

});

// create new product
/* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
router.post('/', async (req, res) => {
  try {
    const data = await Product.create(req.body);

    // check if there are product tags
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: data.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.json(data);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const data = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    //check if there is a proudtc with that id
    if (!data) {
      res.json('No pruduct found with that id!')
      return;
    }
    res.json(data);
  } catch (error) {
    res.json({ message: error.message });

  }
});

module.exports = router;
