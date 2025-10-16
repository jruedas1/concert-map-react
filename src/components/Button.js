import classnames from 'classnames';
import '../css/Button.css';

function Button({
    children,
    primary,
    secondary,
    rounded,
    className,
    onClick
}){
    const classes = classnames(
        className, {
        'primary' : primary,
        'secondary' : secondary,
        'rounded' : rounded
    });

    return <button className={classes} onClick={onClick}>{children}</button>
}

export default Button;