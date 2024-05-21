import Point2D from "./doNotTouch/point2D";

export default class Node {
    point: Point2D
    left: Node | null
    right: Node | null

    constructor(point: Point2D) {
        this.point = point;
        this.right = null;
        this.left = null;
    }
}