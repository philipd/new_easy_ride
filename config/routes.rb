# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

Rails.application.routes.draw do
  get 'pages/calendar'
  get '/calendar', to: "pages#calendar"
  root to: 'pages#home'
  get '/test', to: "pages#test"
  

end
