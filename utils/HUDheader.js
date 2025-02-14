class HUDHeader {
  constructor(container, image) {
    this.container = container;
    this.image = image;

    this.HUDHeader = document.createElement("div");
    this.HUDHeader.style.position = "absolute";
    this.HUDHeader.style.top = "-35px";
    this.HUDHeader.style.left = "540px";
    this.HUDHeader.style.fontSize = "15px";
    this.HUDHeader.style.cursor = "default";
    this.HUDHeader.style.fontFamily = "bomberman";

    const headerImage = document.createElement("img");
    headerImage.src = "../pictures/HUDElements.png";
    headerImage.alt = "Header Image";
    headerImage.style.width = "790px";
    headerImage.style.height = "120px";
    headerImage.style.objectFit = "cover";
    headerImage.style.objectPosition = "top";
    headerImage.style.clipPath = "inset(22% 3% 22% 3%)";

    this.HUDHeader.appendChild(headerImage);

    document.body.appendChild(this.HUDHeader);
  }
}

export default HUDHeader;
