import { Component, OnInit } from '@angular/core';

import { QuizService } from '../services/quiz.service';
import { HelperService } from '../services/helper.service';
import { Option, Question, Quiz, QuizConfig } from '../models/index';
import { HomepageService } from '../homepage/homepage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {
  trueanswer:boolean[];
  quizes: any[];
  score: number = 0;
  final_score: number = 0;
  quiz: Quiz = new Quiz(null);
  mode = 'quiz';
  quizName: string;
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': true,  // kalau dijawab, otomatis ke soal selanjutnya
    'duration': 30,  // lama durasi maksimal dalam mengerjakan soal
    'pageSize': 1,
    'requiredAll': true,  //true kalau semuanya harus terjawab baru bisa submit
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  mins: string | number;
  secs: string | number;
  diff: string | number;
  duration = '';

  constructor(
    private quizService: QuizService,
    private homepageService: HomepageService,
    private route: Router
  ) { }

  ngOnInit() {
    this.quizes = this.quizService.getAll();
    this.quizName = this.quizes[0].id;
    this.loadQuiz(this.quizName);
  }

  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;
      this.startTime = new Date();
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.config.duration);
    });
    this.mode = 'quiz';
  }

  tick() {
    const now = new Date();
    this.diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if(this.diff >= this.config.duration){
      this.onSubmit();
    }
    this.ellapsedTime = this.parseTime(this.diff);
  }

  parseTime(totalSeconds: number) {
    this.mins = Math.floor(totalSeconds / 60);
    this.secs = Math.round(totalSeconds % 60);
    this.mins = (this.mins < 10 ? '0' : '') + this.mins;
    this.secs = (this.secs < 10 ? '0' : '') + this.secs;
    return `${this.mins}:${this.secs}`;
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };


  onSubmit() {
    let answers = [];
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));

    console.log(this.quiz.questions);

    this.mode = 'result';
  }

  logout(){
    localStorage.removeItem('username');
    this.homepageService.userOn = false;
    this.route.navigate(['/home']);
  }

  changeMode(){
    this.mode = 'quiz';
    this.ellapsedTime = '00:00';
    this.startTime = new Date();
  }
}
