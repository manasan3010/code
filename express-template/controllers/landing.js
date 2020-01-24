
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'TETS12d' });
// kitty.save().then(() => console.log('meow'));

const eraseDatabaseOnSync = false;
console.log(models.User)


connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({}),
    ]);
  }

  // createUsersWithMessages();

});

const createUsersWithMessages = async () => {
  const user1 = new models.User({
    username: 'testUser2',
  });
  const message1 = new models.Message({
    text: 'Published the Road to learn React2',
    user: user1.id,
  });
  await user1.save();
  await message1.save();
};

exports.get_landing = function (req, res, next) {
  res.render('index', { title: 'Express' });
}

exports.submit_lead = function (req, res, next) {
  console.log("lead email:", req.body.lead_email);
  res.redirect('/');
}
