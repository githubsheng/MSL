/**
 * Created by wangsheng on 28/10/17.
 */
//todo: I want these interfaces to be like a documentations about questions... I need to add details to it.. like stats...

export interface Question {
    id: string;
    _type: string;
    text: string;
    stats: any;
}

interface Option {
    id: string;
    _type: string;
    text: string;
}

export interface Row extends Option {
    isSelected: boolean;
}

export interface Col extends Option {}

export interface RowsOnly extends Question {
    rows: Array<Row>;
}

export interface Matrix extends RowsOnly {
    cols: Array<Col>;
}

export interface AnswerData {
    questionId: string;
    answers: Array<string>;
    stats: any;
}
