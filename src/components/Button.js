import classnames from 'classnames';
import '../css/Button.css';

function Button({
    children,
    primary,
    secondary,
    rounded,
    onClick
}){
    const classes = classnames( {
        'primary' : primary,
        'secondary' : secondary,
        'rounded' : rounded
    });

    return <button className={classes} onClick={onClick}>{children}</button>
}

export default Button;