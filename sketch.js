var database;
var foodS = 20;
var foodStock;
var dog,dog1,dog2;
var position;
var feed,add,last; 
var foodobject;
var Feedtime;
var Lastfeed;
var name = "Dog"

function preload()
{
  dogimg1 = loadImage("dogImg.png")
  dogimg2 = loadImage("dogImg1.png")
  MilkImage=loadImage("Milk.png");
}

function setup()
 {
    createCanvas(1000, 500);
    database = firebase.database();

    foodobject = new Food();

    dog = createSprite(550,250,10,10);
    dog.addImage(dogimg1);
    dog.scale=0.2;

    foodStock = database.ref('Food');
    foodStock.on("value",readStock);

    Lastfeed = database.ref('FeedTime');
    Lastfeed.on("value",readTime);

    var dog2 = database.ref('Food');
    
    dog2.on("value", readPosition);

    feed = createButton("FEED "+name);
    feed.position(700,115);
    feed.mousePressed(FeedDog);
    dog.addImage(dogimg1);


    add = createButton("ADD FOOD");
    add.position(600,115);
    add.mousePressed(AddFood);
}
function readTime(time)
{
  Feedtime = time.val();
}
function readStock(data)
{
 foodS = data.val();

}

function writeStocks(x){
  if(x<=0)
  {
    x=0;
  }
  else
  {
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

var pasttime,delay = 15,state = "idle";

function draw() 
{  
  background(46,139,87);

  foodobject.display()

  drawSprites();

  fill(255,255,254);
  textSize(15);
  text("Last Fed: "+pasttime, 600, 115);

  drawSprites();

  setToHour();
  if(frame<frameCount-delay)
  {
    dog.addImage(dogimg1);
  }
  if(frame>frameCount-delay)
  {
    image(MilkImage,500+(frameCount-frame),220,100,80);
  }
}

function setToHour()
{
  pasttime = "Undifined"
  if(Feedtime)
  {
    if(Feedtime >=12)
    pasttime = Feedtime- 12 +"PM"
   }
   else 
   {
     pasttime = Feedtime +"AM"
   }
}

function readPosition(data)
{
  position = data.val();
  foodobject.updateFoodStock(position)
}

function writePosition(pos)
{
  if(pos>0)
  {
    pos=pos-1
  }
  else
  {
    pos=0
  }
  database.ref('/').set(
    {
    'Food': pos
    })

}
var frame;
function FeedDog()
{
  if(foodS>0)
  {
    frame = frameCount;

    dog.addImage(dogimg2) 
    foodobject.updateFoodStock(foodobject.getFoodStock()-1)
    database.ref('/').update({
    Food:foodobject.getFoodStock(),
    FeedTime:hour()
   })
  }
}

  function AddFood()
  {
    position++
    database.ref('/').update(
      {
      Food:position
    })
  }



