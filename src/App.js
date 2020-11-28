import React, { useEffect, useRef, useState } from "react";
import useMousePosition from "./hooks/useMousePosition";
import ReactDOM from "react-dom";
import { store } from "./store";
import { TweenMax, TimelineMax } from "gsap";
import useResize from "./hooks/useResize";
import Cursor from "./Cursor";
// helper functions
const MathUtils = {
  // linear interpolation
  lerp: (a, b, n) => (1 - n) * a + n * b,
  // distance between two points
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
};
function App() {
  const [lastMousePos, setlastMousePos] = useState({ x: 0, y: 0 });
  const mousePos = useMousePosition();
  const windowResize = useResize();
  const images = useRef([]);
  const title = useRef(null);
  const [rect, setRect] = useState([]);
  // this will recalcule the image positions everytime the window changed!
  useEffect(() => {
    resize();
  }, [windowResize]);
  /***
   * here when the magic happend
   * everytime the mouse position changed
   *  - calc the latest mouse position and the new position
   *    if the the distance more than 100px then we will show the
   *    new image!
   * 
   */
  useEffect(() => {
    animation();
    //
  }, [mousePos]);
  const getMouseDistance = () =>
    MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);
  
  const defaultStyle = {
    scale: 1,
    x: 0,
    y: 0,
    opacity: 0,
  };
  const getRect = (ele) => {
    // find the image latest position
    const domNode = ReactDOM.findDOMNode(ele);
    return domNode.getBoundingClientRect();
  };
  /**
   * we never the windows size changes we have to change the image positions
   */
  const resize = () => {
    const rects = rect;
    images.current.forEach((e, i) => {
      TweenMax.set(e, defaultStyle);
      rects.push(getRect(e));
    });
    setRect(rects);
  };
  // upcoming image index
  const [imgPosition, setImgPosition] = useState(0);
  // zIndex value to apply to the upcoming image 
  const [zIndexVal, setzIndexVal] = useState(1);
  const animation = () => {
    const imagesTotal = images.current.length;
    // mouse distance required to show the next image
    const threshold = 100;
    let distance = getMouseDistance();
    // cache previous mouse position
    const cacheMousePos = {
      x: MathUtils.lerp(lastMousePos.x || mousePos.x, mousePos.x, 0.1),
      y: MathUtils.lerp(lastMousePos.y || mousePos.y, mousePos.y, 0.1),
    };

    // if the mouse moved more than [threshold] then show the next image
    if (distance > threshold) {
      showNextImage(cacheMousePos);
      setzIndexVal(zIndexVal + 1);
      setImgPosition(imgPosition < imagesTotal - 1 ? imgPosition + 1 : 0);
      setlastMousePos(mousePos);
    } else return;
  };
  const showNextImage = (cacheMousePos) => {
    // show image at position [imgPosition]
    const img = images.current[imgPosition];
    // kill any tween on the image
    TweenMax.killTweensOf(img);
    new TimelineMax()
      // show the image
      .set(
        img,
        {
          startAt: { opacity: 0, scale: 1 },
          opacity: 1,
          scale: 1,
          zIndex: zIndexVal,
          x: cacheMousePos.x - rect[imgPosition].width / 2,
          y: cacheMousePos.y - rect[imgPosition].height / 2,
        },
        0
      )
      // animate position
      .to(
        img,
        0.9,
        {
          ease: "Expo.easeOut",
          x: mousePos.x - rect[imgPosition].width / 2,
          y: mousePos.y - rect[imgPosition].height / 2,
        },
        0
      )
      // then make it disappear
      .to(
        img,
        1,
        {
          ease: "Power1.easeOut",
          opacity: 0,
        },
        0.4
      )
      // scale down the image
      .to(
        img,
        1,
        {
          ease: "Quint.easeOut",
          scale: 0.2,
        },
        0.4
      );
  };
  return (
    <main>
      <div className="message">
        Hover effect &mdash; please view on desktop.
      </div>
      <div className="frame">
        <div className="frame__title-wrap">
          <h4 className="frame__title">
            by Osama Bentaib, photos by{" "}
            <a href="https://unsplash.com">unsplash</a>
          </h4>
        </div>
        <a
          className="frame__github"
          href="https://github.com/OsamaBentaib/lieee/"
        >
          Github
        </a>
        <h2 className="frame__pagetitle">lieee.</h2>
      </div>
      <div className="content">
        {store.map((ele, i) => (
          <img
            ref={(e) => (images.current[i] = e)}
            key={i}
            className="content__img"
            src={ele}
            alt="..."
          />
        ))}
        <h3 ref={title} className="content__title">
          lieee.
        </h3>
      </div>
      <Cursor />
    </main>
  );
}

export default App;
