import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './Rating.scss';

const Rating = ({ value, text, color = '#ffc107', size = '1rem' }) => {
  return (
    <div className="rating" style={{ fontSize: size }}>
      <span style={{ color }}>
        {value >= 1 ? <FaStar /> : value >= 0.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      <span style={{ color }}>
        {value >= 2 ? <FaStar /> : value >= 1.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      <span style={{ color }}>
        {value >= 3 ? <FaStar /> : value >= 2.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      <span style={{ color }}>
        {value >= 4 ? <FaStar /> : value >= 3.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      <span style={{ color }}>
        {value >= 5 ? <FaStar /> : value >= 4.5 ? <FaStarHalfAlt /> : <FaRegStar />}
      </span>
      {text && <span className="rating-text">{text}</span>}
    </div>
  );
};

export default Rating;