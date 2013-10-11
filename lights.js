function Light(shaderStruct, power, color,pos)
{
    this.global = new vecTranslations();
    this.global.translate(pos[0],pos[1],pos[2]);
    this.shader = shaderStruct;
    this.lightColor = color;
    this.lightPower = power;
    this.update = function()
    {
        gl.uniform3fv(this.shader.LightColor, this.lightColor);
        gl.uniform1f(this.shader.LightPower, this.lightPower);
        gl.uniform3fv(this.shader.lightPosition, this.global.getPos() );
    }
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
        this.pos = vec.fromValues(x,y,z);
    }
    this.getPos = function()
    {
        return this.pos;
    }
}
