// src/components/SwipeRouter.js
import { useSwipeable } from 'react-swipeable';
import { useLocation, useNavigate } from 'react-router-dom';

const routes = ['/', '/playlists']; // basic swipeable routes

export default function SwipeRouter({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = routes.indexOf(location.pathname);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < routes.length - 1) {
        navigate(routes[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        navigate(routes[currentIndex - 1]);
      }
    },
    trackTouch: true,
    trackMouse: false,
  });

  return <div {...handlers}>{children}</div>;
}
