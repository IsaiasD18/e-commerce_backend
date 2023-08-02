const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      // be sure to include its associated Product data
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock'], 
        },
        
      ],
      attributes: [
        'id',
        'tag_name'
      ]
    });

    res.json(tagData);
  } catch (error) {
    res.json({message: error.message});
  }  
});

// find a single tag by its `id`
router.get('/:id', async (req, res) => {
  
  try {
    const tagData = await Tag.findByPk(req.params.id,{
      
      attributes: [
        'id', 
        'tag_name'
      ],
      // be sure to include its associated Product data
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock'],
        }
      ]
    });

    //If there is not a tag with the id provided, respond with a message
    if (!tagData) {
      res.json({ message: 'No tag found with that id!' });
      return;
    }

    res.json(tagData);

  } catch (error) {
    res.json({message: error.message});
  }
 
});

// create a new tag
router.post('/', async (req, res) => {
  try {

    const tagData = await Tag.create(req.body);

    res.json(tagData);

  } catch (error) {
    res.json({message: error.message});
  }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update(
      {
        tag_name: req.body.tag_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    if (!tagData) {
      res.json({ message: 'No tag found with that id!' });
      return;
    }

    res.json(tagData);
  } catch (error) {
    res.json({message: error.message});
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.json({ message: 'No tag found with that id!' });
      return;
    }
  } catch (error) {
    res.json({message: error.message});
  }
});

module.exports = router;
