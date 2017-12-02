import { Observable } from 'tns-core-modules/data/observable';
import { Tensorflow } from 'nativescript-tensorflow';

export class HelloWorldModel extends Observable {
  public message: string;
  private tensorflow: Tensorflow;

  constructor() {
    super();

    this.tensorflow = new Tensorflow();
    this.message = this.tensorflow.message;
  }
}
