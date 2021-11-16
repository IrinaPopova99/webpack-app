export class Post {
  constructor(title, image) {
    this.title = title;
    this.image = image;
    this.date = new Date();
  }

  toString() {
    return JSON.stringify({
      title: this.title,
      image: this.image,
      date: this.date.toJSON(),
    })
  }
}
