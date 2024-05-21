import Point2D from "./doNotTouch/point2D";
import RectHV from "./doNotTouch/rectHV";
import Node from "./Node";

class KDTree {
  // you might or might not need to put some parameters for the constructor
  private root: Node | null;

  constructor() {
    this.root = null;
  }

  isEmpty(): boolean {
    return this.root === null;
  }

  size(): number {
    let count = 0;
    function traverse(node: Node | null) {
      if (node) {
        count++;
        traverse(node.left);
        traverse(node.right);
      }
    }
    traverse(this.root);
    return count;
  }

  insert(p: Point2D): void {
    const newNode = new Node(p);
    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    let parent: Node | null = null;
    let isVertical = true;

    while (current) {
      parent = current;
      const compare = isVertical
        ? p.x - current.point.x
        : p.y - current.point.y;
      if (compare < 0) {
        if (current.left !== null) {
          current = current.left;
        } else {
          break;
        }
      } else if (compare > 0 || !p.equals(current.point)) {
        if (current.right !== null) {
          current = current.right;
        } else {
          break;
        }
      } else {
        return;
      }
      isVertical = !isVertical;
    }

    if (parent) {
      const compare = isVertical ? p.x - parent.point.x : p.y - parent.point.y;
      if (compare < 0) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
    }
  }

  contains(p: Point2D): boolean {
    let current = this.root;
    let isVertical = true;

    while (current) {
      const compare = isVertical
        ? p.x - current.point.x
        : p.y - current.point.y;
      if (compare < 0) {
        current = current.left;
      } else if (compare > 0 || !p.equals(current.point)) {
        current = current.right;
      } else {
        return true;
      }
      isVertical = !isVertical;
    }

    return false;
  }

  rangeHelper(
    node: Node | null,
    box: RectHV,
    isVertical: boolean,
    pointsRange: Point2D[]
  ): void {
    if (node === null) return;

    if (box.contains(node.point)) {
      pointsRange.push(node.point);
    }

    if (isVertical) {
      if (node.point.x >= box.xmin) {
        this.rangeHelper(node.left, box, !isVertical, pointsRange);
      }
      if (node.point.x <= box.xmax) {
        this.rangeHelper(node.right, box, !isVertical, pointsRange);
      }
    } else {
      if (node.point.y >= box.ymin) {
        this.rangeHelper(node.left, box, !isVertical, pointsRange);
      }
      if (node.point.y <= box.ymax) {
        this.rangeHelper(node.right, box, !isVertical, pointsRange);
      }
    }
  }

  public range(box: RectHV): Point2D[] {
    const pointsInRange: Point2D[] = [];
    this.rangeHelper(this.root, box, true, pointsInRange);
    return pointsInRange;
  }
}

export default KDTree;
