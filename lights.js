function PointLight(shaderStruct, power, color,pos)
{
    this.global = new vecTranslations();
    this.global.translate(pos[0],pos[1],pos[2]);
    this.shader = shaderStruct;
    this.lightColor = color;
    this.lightPower = power;
    this.setPosition= function(x,y,z)
    {
        this.global.setPosition(x,y,z);
        gl.uniform3fv(this.shader.lightPosition, this.global.getPos() );
    }
    this.update = function()
    {
        gl.uniform3fv(this.shader.LightColor, this.lightColor);
        gl.uniform1f(this.shader.LightPower, this.lightPower);
        gl.uniform3fv(this.shader.lightPosition, this.global.getPos() );
    }
    this.update();
}
function DirectionalLight(shaderStruct,vec,power)
{
    this.direction;
    this.power = power;
    this.shader = shaderStruct;
    this.updateDirection=function(vec)
    {
        this.direction = vec;
        gl.uniform1f(this.shader.DirectionalPower, this.power);
        gl.uniform3fv(this.shader.DirectionalLight, this.direction);
    }
    this.updateDirection(vec);
}
function vecTranslations()
{
    this.pos = vec3.create();
    this.translate = function(x,y,z)
    {
        vec3.add(this.pos,this.pos,vec3.fromValues(x,y,z));
    }
    this.setPosition = function(x,y,z)
    {
        this.pos = vec3.fromValues(x,y,z);
    }
    this.getPos = function()
    {
        return this.pos;
    }
}
