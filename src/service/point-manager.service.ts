import Point from "@/model/Point.model";

export default class PointManager {
  public currentPoints: Point[];

  public constructor() {
    this.currentPoints = [];
  }

  public addNewPoint(point: Point): void {
    this.currentPoints.push(point);
  }
}
