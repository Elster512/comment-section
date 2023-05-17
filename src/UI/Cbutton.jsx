import styles from './Cbutton.module.css';

const Cbutton = ({ title, icon, onClick }) => {
  const style = title === 'Delete' ? styles['delete'] : styles['reply'];

  return (
    <button className={`${styles['custom-button']} ${style}`} onClick={onClick}>
      <i className={`fa-solid fa-${icon} fa-sm`}></i>
      <span>{title}</span>
    </button>
  );
};
export default Cbutton;
