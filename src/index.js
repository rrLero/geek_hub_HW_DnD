// @flow
import './main.less';

const setTopLeftCords = (helperOffsetTop: number, helperOffsetLeft: number, event: MouseEvent, clone: HTMLElement) => {
    clone.style.left = event.pageX - helperOffsetLeft + 'px';
    clone.style.top = event.pageY - helperOffsetTop + 'px';
};

const overlaps = (rect1, rect2) => !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);

const mouseDownHandler = (event: MouseEvent) => {
    if (document.body) {

        const body = document.body;
        const helper = event.currentTarget;

        if (helper instanceof HTMLElement) {
            const clone = helper.cloneNode(true);
            const helperOffsetLeft = event.pageX - helper.offsetLeft;
            const helperOffsetTop = event.pageY - helper.offsetTop;
            setTopLeftCords(helperOffsetTop, helperOffsetLeft, event, clone);
            const product = helper.closest('[data-product]');
            if (product) {
                product.classList.add('product__dragging')
            }
            body.appendChild(clone);

            const carts = [...document.querySelectorAll('[data-cart]')].map((cart) => {
                const rect = {};
                rect.left = cart.offsetLeft;
                rect.top = cart.offsetTop;
                rect.right = rect.left + cart.offsetWidth;
                rect.bottom = rect.top + cart.offsetHeight;
                return {
                    node: cart,
                    rect: rect
                };
            });

            let prevCart;

            const mousemoveHandler = (event: MouseEvent) => {

                setTopLeftCords(helperOffsetTop, helperOffsetLeft, event, clone);

                const cart = carts.find((cart) => {
                    return overlaps(cart.rect, clone.getBoundingClientRect())
                });

                if (cart && cart !== prevCart) {
                    if (prevCart) {
                        prevCart.node.classList.remove('overlaps');
                    }
                    cart.node.classList.add('overlaps');
                    prevCart = cart;
                }
                if (!cart && prevCart) {
                    prevCart.node.classList.remove('overlaps');
                    prevCart = null;
                }
            };
            body.addEventListener('mousemove', mousemoveHandler);

            const mouseupHandler = (event: MouseEvent) => {
                if (prevCart) {
                    if (product && product.parentNode !== prevCart.node) {
                        prevCart.node.appendChild(product);
                    }
                    prevCart.node.classList.remove('overlaps');
                    prevCart = null;
                }
                if (clone.parentNode && product && document.body) {
                    clone.parentNode.removeChild(clone);
                    product.classList.remove('product__dragging');
                }
                body.removeEventListener('mousemove', mousemoveHandler);
                body.removeEventListener('mouseup', mouseupHandler);
            };
            body.addEventListener('mouseup', mouseupHandler);
        }
    }
};

document.querySelectorAll('#products [data-drag-helper]').forEach((node) => {
    node.addEventListener('mousedown', mouseDownHandler);
});
