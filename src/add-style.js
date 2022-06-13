const style = `[data-cleanface] {display: none}`;
const theyLiveStyle = `
[data-cleanface][data-theylive]{
  position: relative;
  display: block;
}

[data-theylive]:before {
  content: attr(data-theylive);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 60px;
  font-weight: 900;
  text-transform: uppercase;
  background: rgba(255,255,255,.98);
}

.side-clean-face:before {
  font-size: 40px;
}
`;

export function addStyle(theyLive = false) {
  const styleElement = document.createElement('style');
  let styleContent = style;
  if(theyLive){
    styleContent += theyLiveStyle;
  }
  styleElement.innerHTML = styleContent;
  document.body.appendChild(styleElement);
}