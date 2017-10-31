//todo: I want these interfaces to be like a documentations about questions... I need to add details to it.. like stats...

export interface Question {
    id: string;
    _type: string;
    text: string;
    stats: any;
    answers: any;
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
    rows: any;
}

export interface Matrix extends RowsOnly {
    cols: any;
}

export interface AnswerData {
    questionId: string;
    answers: Array<string>;
    stats: any;
}
