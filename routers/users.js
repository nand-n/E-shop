const router = require('express').Router();
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
  const userList = await User.find().select('name phone email');

  if (!userList) res.status(500).json({ sucess: false });

  res.send(userList);
});
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('name phone email');
  if (!user)
    return res
      .status(500)
      .json({ message: 'The User with the given ID was not found' });
  res.status(200).send(user);
});
router.post('/', async (req, res) => {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    street: req.body.street,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) return res.status(404).send('The User can not be created');
  res.send(user);
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET;

  if (!user) return res.status(400).send('the user is not fund ');

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: '1d',
      }
    );
    return res.status(200).send({ user: user.email, token });
  } else return res.status(400).send('password is Wrong!!!');
});
router.get('/token', (req, res) => {
  res.status(200).send({ user: user.email, token });
});

router.post('/register', async (req, res) => {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    street: req.body.street,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) return res.status(404).send('The User can not be created');
  res.send(user);
});
router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) res.status(500).json({ success: false });
  res.send({ userCount: userCount });
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({ success: true, message: 'The User is Deleted' });
      } else {
        res
          .status(400)
          .json({ success: false, message: 'The User Could not be Founded ' });
      }
    })
    .catch((err) => res.status(400).json({ success: false, eroor: err }));
});

module.exports = router;
