# BiteMenu
Creating food menu application using springboot as backend and react as frontend

# Needs to be done
1. fix: price can be float
2. Handle Place Order by keeping order history 
3. Admin can see All previous history
4. Sale data 

# Things need to remember
1. Jsession ID with not work when we want horizontal scaling where we will deal with multiple servers not simply one server in that case use of JWT will work.
i. without JWT, where all the servers can share the same database or may a cachae OR load balancer.
ii. With JWT where server will give a token(JSON web Token), similarly to anology of digital signed pass which authenticated user can use.
JWT helps in transfering data between two parties with security.