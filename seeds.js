var mongoose   = require('mongoose');
var Campground = require('./models/campground');
var Comment    = require('./models/comment');
var data = [
  {
    name:'Hawkesbury Del Rio',
    image:'https://farm4.staticflickr.com/3053/2586934044_339a678e73.jpg',
    description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis non dicta aut quo sunt excepturi iusto, laboriosam! Eos laudantium modi sit, ipsum deleniti est id beatae explicabo earum, veniam iusto repellendus recusandae, doloremque, voluptatum quasi architecto voluptas facere accusamus libero laborum debitis. Quas quasi qui quos nisi iste dignissimos aliquam.'


  },
  {
    name:'Eagle\'s Nest',
    image:'https://farm9.staticflickr.com/8309/7968772438_3e0935fab7.jpg',
    description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis non dicta aut quo sunt excepturi iusto, laboriosam! Eos laudantium modi sit, ipsum deleniti est id beatae explicabo earum, veniam iusto repellendus recusandae, doloremque, voluptatum quasi architecto voluptas facere accusamus libero laborum debitis. Quas quasi qui quos nisi iste dignissimos aliquam.'
  },
  {
    name:'Glamping Paradise',
    image:'https://farm4.staticflickr.com/3397/3662177625_a9c2e794be.jpg',
    description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis non dicta aut quo sunt excepturi iusto, laboriosam! Eos laudantium modi sit, ipsum deleniti est id beatae explicabo earum, veniam iusto repellendus recusandae, doloremque, voluptatum quasi architecto voluptas facere accusamus libero laborum debitis. Quas quasi qui quos nisi iste dignissimos aliquam.'
  },
  {
    name:'Granite Hill',
    image:'https://farm8.staticflickr.com/7179/6927088769_cc14a7c68e.jpg',
    description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis non dicta aut quo sunt excepturi iusto, laboriosam! Eos laudantium modi sit, ipsum deleniti est id beatae explicabo earum, veniam iusto repellendus recusandae, doloremque, voluptatum quasi architecto voluptas facere accusamus libero laborum debitis. Quas quasi qui quos nisi iste dignissimos aliquam.'
  }
];
function seedDB(){
  // Remove all campgrounds
  Campground.remove({}, (err)=>{
    if(err){
      return console.log(err);
    }
  // data.forEach((seed)=>{
  //   Campground.create(seed, (err,campground)=>{
  //     if(err){
  //       console.log(err);
  //     }else{
  //       console.log('Added a campground');
  //       Comment.create(
  //         {
  //           text:"Great spot, better with internet",
  //           author: 'Homer'
  //         },(err,comment)=>{
  //           if(err){
  //             console.log(err);
  //           }else{
  //             campground.comments.push(comment);
  //             campground.save();
  //             console.log('Created new comment');
  //           }
  //         });
  //     }
  //   })
  // }); 
});
}

module.exports = seedDB;
